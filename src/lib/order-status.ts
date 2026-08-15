export const orderStatusLabels: Record<string, string> = {
  pending: "অপেক্ষমান",
  confirmed: "নিশ্চিত হয়েছে",
  processing: "প্রসেসিং হচ্ছে",
  packed: "প্যাক করা হয়েছে",
  shipped: "পাঠানো হয়েছে",
  out_for_delivery: "ডেলিভারির পথে",
  delivered: "ডেলিভারি সম্পন্ন",
  cancelled: "বাতিল হয়েছে",
  returned: "ফেরত দেওয়া হয়েছে",
};

export const paymentMethodLabels: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  bkash: "bKash",
  nagad: "Nagad",
  online: "অনলাইন পেমেন্ট",
};

export const paymentStatusLabels: Record<string, string> = {
  pending: "পেমেন্ট বাকি",
  paid: "পরিশোধিত",
  failed: "ব্যর্থ হয়েছে",
  refunded: "ফেরত দেওয়া হয়েছে",
};
