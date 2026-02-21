const companies = [
  "Google", "Infosys", "TCS", "Wipro", "Accenture",
  "Zoho", "Bosch", "KPMG", "Amazon", "Microsoft",
  "Cognizant", "HCL", "Capgemini", "Deloitte",
];

const CompanyMarquee = () => {
  return (
    <div className="overflow-hidden border-y border-border bg-muted/30 py-6">
      <div className="animate-marquee flex w-max items-center gap-12">
        {[...companies, ...companies].map((company, i) => (
          <div
            key={`${company}-${i}`}
            className="flex h-10 items-center rounded-lg bg-background px-5 py-2 shadow-card"
          >
            <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground">
              {company}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyMarquee;
