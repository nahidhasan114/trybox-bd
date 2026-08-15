export const metadata = { title: "শর্তাবলী" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">শর্তাবলী</h1>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>ওয়েবসাইট ব্যবহার করে অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।</li>
          <li>প্রোডাক্টের দাম ও স্টক যেকোনো সময় পরিবর্তন হতে পারে।</li>
          <li>ভুল/অসম্পূর্ণ তথ্য দিয়ে অর্ডার করলে অর্ডার বাতিল হতে পারে।</li>
          <li>Cash on Delivery অর্ডারে পণ্য গ্রহণ না করলে ভবিষ্যতে অর্ডার সীমিত করা হতে পারে।</li>
          <li>ওয়েবসাইটের কনটেন্ট, ছবি ও লোগোর সর্বস্বত্ব {"TryBox BD"}-এর।</li>
        </ul>
      </div>
    </div>
  );
}
