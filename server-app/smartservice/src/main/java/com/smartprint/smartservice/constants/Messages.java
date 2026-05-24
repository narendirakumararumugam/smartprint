package com.smartprint.smartservice.constants;

public final class Messages {

    private Messages() {}

    public static final class Auth {
        public static final String EMAIL_ALREADY_REGISTERED = "Email is already registered";
        public static final String INVALID_CREDENTIALS = "Invalid credentials";
        public static final String USER_NOT_FOUND = "User not found";
        public static final String INVALID_REFRESH_TOKEN = "Invalid or expired refresh token";
    }

    public static final class Orders {
        public static final String ORDER_NOT_FOUND = "Order not found";
        public static final String SHOP_NOT_FOUND = "Shop not found";
        public static final String CANNOT_CANCEL = "Order cannot be cancelled in current state";
        public static final String NOT_READY_FOR_PICKUP = "Order is not ready for pickup";
        public static final String NOT_AUTHORIZED_VIEW = "Not authorized to view this shop's orders";
        public static final String NOT_AUTHORIZED_UPDATE = "Not authorized to update this order";
        public static final String INVALID_STATUS = "Invalid order status: ";
    }

    public static final class Printers {
        public static final String PRINTER_NOT_FOUND = "Printer not found";
        public static final String NOT_BELONG_TO_SHOP = "Printer does not belong to this shop";
    }

    public static final class Lookup {
        public static final String USER_TYPE_NOT_FOUND = "User type not found: ";
        public static final String ORDER_STATUS_NOT_FOUND = "Order status not found: ";
        public static final String TIMELINE_STATE_NOT_FOUND = "Timeline state not found: ";
        public static final String PRINTER_STATUS_NOT_FOUND = "Printer status not found: ";
    }

    public static final class Owner {
        public static final String EMAIL_ALREADY_REGISTERED = "Email is already registered";
    }

    public static final class Common {
        public static final String GENERIC_ERROR = "Something went wrong. Please try again.";
    }
}
