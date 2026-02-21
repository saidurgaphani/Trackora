import { useNavigate } from "react-router-dom";

const footerLinks = {
  "Prepare": ["Aptitude", "Reasoning", "Verbal Ability", "Computer Fundamentals"],
  "Coding": ["Learn C", "Learn C++", "Learn Java", "Learn Python"],
  "Company": ["About Us", "Careers", "Contact", "Blog"],
  "Support": ["Help Center", "Privacy Policy", "Terms of Service", "FAQ"],
};

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/login", { state: { from: "/student/courses" } });
  };

  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-extrabold text-white">T</span>
              </div>
              <span className="text-lg font-bold text-white">
                Trackora
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              India's #1 Placement Preparation Platform. Trusted by 10M+ students.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={handleNavigation}
                      className="text-sm text-slate-400 transition-colors hover:text-primary hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © 2026 Trackora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
