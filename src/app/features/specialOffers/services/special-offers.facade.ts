import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { ROLES } from '@shared/constants/roles.constants';
import { CreateSpecialOffer } from '../models/CreateSpecialOffer';
import { CreateSpecialOfferResponse } from '../models/CreateSpecialOfferResponse';
import {
  CreateSpecialOfferBooking,
  UpdateSpecialOfferBooking,
} from '../models/CreateSpecialOfferBooking';
import {
  SpecialOfferBookingReport,
  SpecialOfferBookingReportItem,
} from '../models/CreateSpecialOfferBookingResponse';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { Doctor } from '@features/doctors/models/Doctor';
import { DoctorClinicsResponse } from '@features/doctors/models/DoctorClinicsResponse';
import { DoctorScheduleApiService } from '@features/doctorSchedules/services/doctor-schedule-api.service';
import { DoctorSchedule } from '@features/doctorSchedules/models/DoctorSchedule';
import { SpecialOffersApiService } from './special-offers-api.service';

@Service()
export class SpecialOffersFacade {
  private readonly api = inject(SpecialOffersApiService);
  private readonly messages = inject(AppMessageService);
  private readonly identity = inject(IdentityService);
  private readonly doctorApi = inject(DoctorApiService);
  private readonly scheduleApi = inject(DoctorScheduleApiService);
  private detailsRequestId = 0;

  readonly isManager = computed(
    () => this.identity.userRole() === ROLES.Admin || this.identity.userRole() === ROLES.Accountant,
  );
  readonly isReception = computed(() => this.identity.userRole() === ROLES.Reception);
  readonly isAccountant = computed(() => this.identity.userRole() === ROLES.Accountant);
  readonly offers = signal<CreateSpecialOfferResponse[]>([]);
  readonly selectedOffer = signal<CreateSpecialOfferResponse | null>(null);
  readonly offerToDelete = signal<CreateSpecialOfferResponse | null>(null);
  readonly selectedOfferDetails = signal<CreateSpecialOfferResponse | null>(null);
  readonly bookingReport = signal<SpecialOfferBookingReport | null>(null);
  readonly bookingToEdit = signal<SpecialOfferBookingReportItem | null>(null);
  readonly bookingToDelete = signal<SpecialOfferBookingReportItem | null>(null);
  readonly bookingToConvert = signal<SpecialOfferBookingReportItem | null>(null);
  readonly doctors = signal<Doctor[]>([]);
  readonly schedules = signal<DoctorSchedule[]>([]);
  readonly isLoading = signal(false);
  readonly isLoadingDetails = signal(false);
  readonly isLoadingBookings = signal(false);
  readonly isLoadingDoctors = signal(false);
  readonly isLoadingSchedules = signal(false);
  readonly isSaving = signal(false);
  readonly isSavingBooking = signal(false);
  readonly isDeleting = signal(false);
  readonly isDeletingBooking = signal(false);
  readonly isConvertingBooking = signal(false);

  readonly isFormOpen = signal(false);
  readonly isBookingFormOpen = signal(false);
  readonly error = signal('');
  readonly detailsError = signal('');
  readonly bookingsError = signal('');
  readonly bookingActionError = signal('');
  readonly conversionDoctorId = signal('');
  readonly conversionScheduleId = signal<number | null>(null);
  readonly conversionDoctorClinicId = signal<number | null>(null);
  readonly doctorClinics = signal<DoctorClinicsResponse[]>([]);
  readonly isLoadingDoctorClinics = signal(false);
  readonly isBookingOperator = computed(
    () =>
      this.identity.userRole() === ROLES.Admin ||
      this.identity.userRole() === ROLES.Accountant ||
      this.identity.userRole() === ROLES.Reception,
  );

  readonly activeStatusFilter = signal<boolean | undefined>(this.isReception() ? true : undefined);

  setActiveStatusFilter(status: boolean | undefined): void {
    this.activeStatusFilter.set(status);
    void this.loadOffers();
  }

  async loadOffers(): Promise<void> {
    this.isLoading.set(true);
    this.error.set('');
    try {
      const response = await firstValueFrom(
        this.api.getAllSpecialOffers(this.activeStatusFilter()),
      );
      if (!response.isSuccess) throw new Error(response.message);
      this.offers.set(response.data ?? []);
    } catch (error: any) {
      this.offers.set([]);
      this.error.set(error.error.message || 'تعذر تحميل الخصومات. حاول تحديث الصفحة.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadOfferDetails(id: number): Promise<void> {
    const requestId = ++this.detailsRequestId;
    this.selectedOfferDetails.set(null);
    this.bookingReport.set(null);
    this.detailsError.set('');
    this.bookingsError.set('');
    if (!Number.isSafeInteger(id) || id < 1) {
      this.detailsError.set('رقم الخصم غير صحيح.');
      return;
    }

    this.isLoadingDetails.set(true);
    this.isLoadingBookings.set(true);
    const [offerResult, reportResult] = await Promise.allSettled([
      firstValueFrom(this.api.getSpecialOfferById(id)),
      firstValueFrom(this.api.getSpecialOfferReport(id)),
    ]);

    if (requestId !== this.detailsRequestId) return;
    this.isLoadingDetails.set(false);
    this.isLoadingBookings.set(false);

    if (
      offerResult.status === 'fulfilled' &&
      offerResult.value.isSuccess &&
      offerResult.value.data
    ) {
      this.selectedOfferDetails.set(offerResult.value.data);
    } else {
      this.detailsError.set('تعذر تحميل تفاصيل الخصم. تحقق من الرقم وحاول مرة أخرى.');
    }

    if (
      reportResult.status === 'fulfilled' &&
      reportResult.value.isSuccess &&
      reportResult.value.data
    ) {
      this.bookingReport.set(reportResult.value.data);
    } else {
      this.bookingsError.set('تعذر تحميل حجوزات الخصم. حاول تحديث القائمة.');
    }
  }

  openCreateBooking(): void {
    if (!this.isBookingOperator() || !this.selectedOfferDetails()) return;
    this.bookingToEdit.set(null);
    this.bookingActionError.set('');
    this.isBookingFormOpen.set(true);
  }

  openEditBooking(booking: SpecialOfferBookingReportItem): void {
    if (!this.isBookingOperator()) return;
    this.bookingToEdit.set(booking);
    this.bookingActionError.set('');
    this.isBookingFormOpen.set(true);
  }

  closeBookingForm(): void {
    if (this.isSavingBooking()) return;
    this.isBookingFormOpen.set(false);
    this.bookingToEdit.set(null);
    this.bookingActionError.set('');
  }

  async saveBooking(booking: Omit<CreateSpecialOfferBooking, 'specialOfferId'>): Promise<void> {
    const offer = this.selectedOfferDetails();
    if (!this.isBookingOperator() || !offer || this.isSavingBooking()) return;
    this.isSavingBooking.set(true);
    this.bookingActionError.set('');
    try {
      const selected = this.bookingToEdit();
      const response = selected
        ? await firstValueFrom(
            this.api.updateSpecialOfferBooking({
              ...booking,
              id: selected.bookingId,
              specialOfferId: offer.id,
            } satisfies UpdateSpecialOfferBooking),
          )
        : await firstValueFrom(
            this.api.createSpecialOfferBooking({
              ...booking,
              specialOfferId: offer.id,
            } satisfies CreateSpecialOfferBooking),
          );
      if (!response.isSuccess || !response.data) throw new Error(response.message);
      this.messages.addSuccessMessage(selected ? 'تم تعديل الحجز بنجاح' : 'تمت إضافة الحجز بنجاح');
      this.isBookingFormOpen.set(false);
      this.bookingToEdit.set(null);
      await this.loadOfferDetails(offer.id);
    } catch (error: any) {
      this.bookingActionError.set(
        error.error.message || 'تعذر حفظ الحجز. راجع البيانات وحاول مرة أخرى.',
      );
      this.messages.showHttpError(error, 'تعذر حفظ الحجز');
    } finally {
      this.isSavingBooking.set(false);
    }
  }

  requestDeleteBooking(booking: SpecialOfferBookingReportItem): void {
    if (this.isBookingOperator()) this.bookingToDelete.set(booking);
  }

  cancelDeleteBooking(): void {
    if (!this.isDeletingBooking()) this.bookingToDelete.set(null);
  }

  async deleteBooking(): Promise<void> {
    const booking = this.bookingToDelete();
    const offer = this.selectedOfferDetails();
    if (!this.isBookingOperator() || !booking || !offer || this.isDeletingBooking()) return;
    this.isDeletingBooking.set(true);
    try {
      const response = await firstValueFrom(this.api.deleteSpecialOfferBooking(booking.bookingId));
      if (!response.isSuccess || !response.data) throw new Error(response.message);
      this.messages.addSuccessMessage('تم حذف الحجز من العرض');
      this.bookingToDelete.set(null);
      await this.loadOfferDetails(offer.id);
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر حذف الحجز');
    } finally {
      this.isDeletingBooking.set(false);
    }
  }

  async openConvertBooking(booking: SpecialOfferBookingReportItem): Promise<void> {
    if (!this.isBookingOperator()) return;
    this.bookingToConvert.set(booking);
    this.conversionDoctorId.set('');
    this.conversionScheduleId.set(null);
    this.conversionDoctorClinicId.set(null);
    this.schedules.set([]);
    this.doctorClinics.set([]);
    if (this.doctors().length === 0) await this.loadDoctors();
  }

  closeConvertBooking(): void {
    if (this.isConvertingBooking()) return;
    this.bookingToConvert.set(null);
    this.conversionDoctorId.set('');
    this.conversionScheduleId.set(null);
    this.conversionDoctorClinicId.set(null);
    this.schedules.set([]);
    this.doctorClinics.set([]);
  }

  async loadDoctors(): Promise<void> {
    this.isLoadingDoctors.set(true);
    try {
      const response = await firstValueFrom(this.doctorApi.getAllDoctors(true));
      if (!response.isSuccess) throw new Error(response.message);
      this.doctors.set(response.data ?? []);
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر تحميل الأطباء النشطين');
    } finally {
      this.isLoadingDoctors.set(false);
    }
  }

  async selectConversionDoctor(doctorId: string): Promise<void> {
    this.conversionDoctorId.set(doctorId);
    this.conversionScheduleId.set(null);
    this.conversionDoctorClinicId.set(null);
    this.schedules.set([]);
    this.doctorClinics.set([]);
    if (!doctorId) return;

    this.isLoadingSchedules.set(true);
    this.isLoadingDoctorClinics.set(true);
    try {
      const [schedulesRes, clinicsRes] = await Promise.all([
        firstValueFrom(this.scheduleApi.getDoctorScheduleByDoctorId(doctorId, true, true)),
        firstValueFrom(this.doctorApi.getDoctorClinicsByDoctorId(doctorId)),
      ]);
      if (schedulesRes.isSuccess) {
        this.schedules.set(schedulesRes.data ?? []);
      }
      if (clinicsRes.isSuccess) {
        const clinics = clinicsRes.data ?? [];
        this.doctorClinics.set(clinics);
        if (clinics.length > 0) {
          this.conversionDoctorClinicId.set(clinics[0].id);
        }
      }
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر تحميل بيانات الطبيب');
    } finally {
      this.isLoadingSchedules.set(false);
      this.isLoadingDoctorClinics.set(false);
    }
  }

  async convertBookingToAppointment(): Promise<void> {
    const booking = this.bookingToConvert();
    const offer = this.selectedOfferDetails();
    const scheduleId = this.conversionScheduleId();
    const doctorClinicId = this.conversionDoctorClinicId();
    if (
      !this.isBookingOperator() ||
      !booking ||
      !offer ||
      !this.conversionDoctorId() ||
      !scheduleId ||
      !doctorClinicId ||
      this.isConvertingBooking()
    )
      return;

    this.isConvertingBooking.set(true);
    try {
      const response = await firstValueFrom(
        this.api.createAppointmentFromSpecialOfferBooking({
          bookingId: booking.bookingId,
          doctorId: this.conversionDoctorId(),
          doctorScheduleId: scheduleId,
          doctorClinicId: doctorClinicId,
        }),
      );
      if (!response.isSuccess || response.data !== true) throw new Error(response.message);
      this.messages.addSuccessMessage('تم تحويل الحجز إلى موعد بنجاح');
      this.bookingToConvert.set(null);
      this.conversionDoctorId.set('');
      this.conversionScheduleId.set(null);
      this.conversionDoctorClinicId.set(null);
      this.schedules.set([]);
      this.doctorClinics.set([]);
      await this.loadOfferDetails(offer.id);
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر تحويل الحجز إلى موعد');
    } finally {
      this.isConvertingBooking.set(false);
    }
  }

  openCreateForm(): void {
    if (!this.isManager()) return;
    this.selectedOffer.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(offer: CreateSpecialOfferResponse): void {
    if (!this.isManager()) return;
    this.selectedOffer.set(offer);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    if (this.isSaving()) return;
    this.isFormOpen.set(false);
    this.selectedOffer.set(null);
  }

  async saveOffer(offer: CreateSpecialOffer): Promise<void> {
    if (!this.isManager() || this.isSaving()) return;
    this.isSaving.set(true);
    try {
      const selected = this.selectedOffer();
      const response = selected
        ? await firstValueFrom(this.api.updateSpecialOffer({ ...selected, ...offer }))
        : await firstValueFrom(this.api.createSpecialOffer(offer));
      if (!response.isSuccess) throw new Error(response.message);
      this.messages.addSuccessMessage(selected ? 'تم تعديل الخصم بنجاح' : 'تمت إضافة الخصم بنجاح');
      this.isFormOpen.set(false);
      this.selectedOffer.set(null);
      await this.loadOffers();
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر حفظ بيانات الخصم');
    } finally {
      this.isSaving.set(false);
    }
  }

  requestDelete(offer: CreateSpecialOfferResponse): void {
    if (this.isManager()) this.offerToDelete.set(offer);
  }

  cancelDelete(): void {
    if (!this.isDeleting()) this.offerToDelete.set(null);
  }

  async deleteOffer(): Promise<void> {
    const offer = this.offerToDelete();
    if (!this.isManager() || !offer || this.isDeleting()) return;
    this.isDeleting.set(true);
    try {
      const response = await firstValueFrom(this.api.deleteSpecialOffer(offer.id));
      if (!response.isSuccess || response.data !== true) throw new Error(response.message);
      this.messages.addSuccessMessage('تم حذف الخصم بنجاح');
      this.offerToDelete.set(null);
      await this.loadOffers();
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر حذف الخصم');
    } finally {
      this.isDeleting.set(false);
    }
  }

  async toggleStatus(offer: CreateSpecialOfferResponse): Promise<void> {
    if (!this.isManager()) return;
    try {
      const response = await firstValueFrom(this.api.toggleSpecialOfferStatus(offer.id));
      if (!response.isSuccess || response.data !== true) throw new Error(response.message);
      this.messages.addSuccessMessage(offer.isActive ? 'تم إيقاف الخصم' : 'تم تفعيل الخصم');
      await this.loadOffers();
    } catch (error: any) {
      this.messages.addErrorMessage(error.error.message || 'تعذر تغيير حالة الخصم');
    }
  }
}
