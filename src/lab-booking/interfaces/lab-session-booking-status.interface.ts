export interface BookingStatus {
    computerId: string;
    computerName: string;
    isBooked: boolean;
    bookedByUserId: string | null;
    bookingId: string | null;
}

export interface LabSessionBookingStatus {
    labSessionId: string;
    labSessionName: string;
    labId: string;
    bookingDetails: BookingStatus[];
}
