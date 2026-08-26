import type { QRInputData, QRType } from "@/types/qr";

export function createEmptyData(type: QRType): QRInputData {
  switch (type) {
    case "url":
      return { type, url: "", title: "" };
    case "text":
      return { type, text: "", title: "" };
    case "email":
      return { type, email: "", subject: "", message: "" };
    case "phone":
      return { type, phone: "" };
    case "wifi":
      return { type, ssid: "", password: "", security: "WPA", hidden: false };
    case "contact":
      return {
        type,
        fullName: "",
        organization: "",
        phone: "",
        email: "",
        website: "",
        address: "",
      };
    case "location":
      return { type, latitude: "", longitude: "", title: "" };
  }
}
