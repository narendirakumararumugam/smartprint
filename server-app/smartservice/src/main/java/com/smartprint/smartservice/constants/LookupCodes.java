package com.smartprint.smartservice.constants;

public final class LookupCodes {

    private LookupCodes() {}

    public static final class UserTypes {
        public static final String CUSTOMER = "customer";
        public static final String OWNER = "owner";
        public static final String ADMIN = "admin";
    }

    public static final class OrderStatuses {
        public static final String PROCESSING = "processing";
        public static final String ACTIVE = "active";
        public static final String READY = "ready";
        public static final String COMPLETED = "completed";
        public static final String CANCELLED = "cancelled";
    }

    public static final class TimelineStates {
        public static final String DONE = "done";
        public static final String ACTIVE = "active";
        public static final String PENDING = "pending";
    }

    public static final class PrinterStatuses {
        public static final String IDLE = "idle";
        public static final String PRINTING = "printing";
        public static final String OFFLINE = "offline";
        public static final String ERROR = "error";
        public static final String LOW_INK = "low-ink";
    }

    public static final class PrintJobStatuses {
        public static final String QUEUED = "queued";
        public static final String PRINTING = "printing";
        public static final String DONE = "done";
        public static final String FAILED = "failed";
        public static final String CANCELLED = "cancelled";
    }

    public static final class ColorModes {
        public static final String BW = "bw";
        public static final String COLOR = "color";
    }

    public static final class PrintSides {
        public static final String SINGLE = "single";
        public static final String DOUBLE = "double";
    }

    public static final class PaperSizes {
        public static final String A4 = "A4";
        public static final String A3 = "A3";
        public static final String A5 = "A5";
        public static final String LETTER = "Letter";
        public static final String PHOTO = "Photo";
    }

    public static final class VerificationStatuses {
        public static final String PENDING = "pending";
        public static final String APPROVED = "approved";
        public static final String REJECTED = "rejected";
    }
}
