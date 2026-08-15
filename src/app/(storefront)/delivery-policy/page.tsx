export const metadata = { title: "ডেলিভারি নীতি" };

export default function DeliveryPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">ডেলিভারি নীতি</h1>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>আমরা সারা বাংলাদেশে ডেলিভারি প্রদান করি।</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>ঢাকার ভিতরে সাধারণত ১-২ কার্যদিবসের মধ্যে ডেলিভারি হয়।</li>
          <li>ঢাকার বাইরে সাধারণত ২-৫ কার্যদিবসের মধ্যে ডেলিভারি হয়।</li>
          <li>নির্বাচিত প্রোডাক্ট বা অর্ডারে ফ্রি ডেলিভারি সুবিধা থাকতে পারে, যা প্রোডাক্ট পেজে উল্লেখ থাকবে।</li>
          <li>ডেলিভারি চার্জ চেকআউটের সময় দেখানো হবে, এলাকা অনুযায়ী পরিবর্তিত হতে পারে।</li>
          <li>প্রাকৃতিক দুর্যোগ বা অনিবার্য পরিস্থিতিতে ডেলিভারিতে বিলম্ব হতে পারে।</li>
        </ul>
        <p>ডেলিভারি সংক্রান্ত যেকোনো প্রশ্নে আমাদের সাথে যোগাযোগ করুন।</p>
      </div>
    </div>
  );
}
