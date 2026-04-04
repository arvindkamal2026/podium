interface ScenarioDisplayProps {
  title: string;
  businessContext: string;
  role: string;
  task: string;
  eventName: string;
}

export function ScenarioDisplay({
  title,
  businessContext,
  role,
  task,
  eventName,
}: ScenarioDisplayProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 space-y-4">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
          {eventName} — Role Play Scenario
        </p>
        <h2 className="font-headline text-xl font-bold text-on-surface">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">
            Business Context
          </p>
          <p className="text-sm text-on-surface leading-relaxed">
            {businessContext}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">
            Your Role
          </p>
          <p className="text-sm text-on-surface leading-relaxed">{role}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">
            Your Task
          </p>
          <p className="text-sm text-on-surface leading-relaxed">{task}</p>
        </div>
      </div>
    </div>
  );
}
