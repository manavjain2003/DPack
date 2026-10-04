import { CheckCircle2, Circle } from "lucide-react";

/**
 * Courier scan timeline (newest first). Used on both the admin order page and
 * the customer's account page, so styling is neutral.
 */
export default function OrderTimeline({ events = [] }) {
  if (!events.length) {
    return <p className="text-sm text-gray-400">No tracking updates yet.</p>;
  }

  return (
    <ol className="relative space-y-5 border-l border-gray-200 pl-6">
      {events.map((ev, i) => {
        const latest = i === 0;
        return (
          <li key={`${ev.date}-${i}`} className="relative">
            <span className="absolute -left-[31px] top-0.5 bg-white">
              {latest ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
            </span>
            <p className={`text-sm ${latest ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
              {ev.activity || ev.status}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {[ev.status && ev.activity ? ev.status : null, ev.location, ev.date]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
