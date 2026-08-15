export const metadata = { title: "প্রাইভেসি পলিসি" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">প্রাইভেসি পলিসি</h1>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে গুরুত্বপূর্ণ।</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>অর্ডার প্রসেস করার জন্য আমরা শুধুমাত্র প্রয়োজনীয় তথ্য (নাম, ফোন নম্বর, ঠিকানা) সংগ্রহ করি।</li>
          <li>আপনার তথ্য শুধুমাত্র অর্ডার ডেলিভারি ও কাস্টমার সাপোর্টের জন্য ব্যবহার করা হয়।</li>
          <li>আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করা হয় না।</li>
          <li>পেমেন্ট তথ্য আমাদের কাছে সংরক্ষণ করা হয় না — bKash/Nagad পেমেন্ট সরাসরি আপনার নিজের অ্যাপ থেকে করা হয়।</li>
        </ul>
      </div>
    </div>
  );
}
