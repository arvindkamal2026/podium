export function PIAttribution({ pdfUrl }: { pdfUrl?: string }) {
  return (
    <p className="text-xs text-outline mt-4">
      Performance Indicators sourced from DECA Inc.&apos;s official guidelines.{" "}
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          View official PDF →
        </a>
      )}
    </p>
  );
}
