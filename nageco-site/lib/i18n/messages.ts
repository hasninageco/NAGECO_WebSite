import type { SiteLocale } from "@/lib/site-locale";

export type I18nNavItem = {
  href: string;
  label: string;
  children?: Array<{ href: string; label: string }>;
};

export type I18nMessages = {
  navbar: {
    companyName: string;
    latestBreakingLabel: string;
    latestBreakingActionTitle: string;
    latestBreakingDefaultTitle: string;
    executionTagline: string;
    requestConsultation: string;
    navItems: I18nNavItem[];
  };
  footer: {
    trustedTitle: string;
    quickLinks: string;
    about: string;
    services: string;
    projects: string;
    news: string;
    importantLinks: string;
    contact: string;
    startConversation: string;
    privacy: string;
    terms: string;
    allRightsReserved: string;
  };
};

const messages: Record<SiteLocale, I18nMessages> = {
  en: {
    navbar: {
      companyName: "North African Geophysical Exploration Company",
      latestBreakingLabel: "Last Breaking",
      latestBreakingActionTitle: "Go to latest news",
      latestBreakingDefaultTitle: "Latest updates from NAGECO Newsroom",
      executionTagline: "Field-ready geophysical execution",
      requestConsultation: "Request Consultation",
      navItems: [
        { href: "/", label: "Home" },
        {
          href: "/about",
          label: "About",
          children: [
            { href: "/about", label: "How we are" },
            { href: "/gallery", label: "Gallery" },
            { href: "/capabilities", label: "Capabilities" },
            { href: "/industries", label: "Industries" },
            { href: "/about/organizational-structure", label: "Organizational Structure" },
            { href: "/about/hive-chart", label: "Hive Chart" },
            { href: "/about/site-map", label: "Website Hierarchy" }
          ]
        },
        { href: "/services", label: "Services" },
        { href: "/career", label: "Career" },
        { href: "/partner", label: "Clients" },
        {
          href: "/operations",
          label: "Operations",
          children: [
            { href: "/crew", label: "Crew" },
            { href: "/projects", label: "Projects" }
          ]
        },
        { href: "/news", label: "News" },
        { href: "/related-links", label: "Related Links" },
        { href: "/our-team", label: "Our Team" },
        { href: "/tender", label: "Tender" },
        { href: "/hse", label: "HSE" },
        { href: "/contact", label: "Contact" }
      ]
    },
    footer: {
      trustedTitle: "Trusted field execution with sharper subsurface insight.",
      quickLinks: "Quick Links",
      about: "About",
      services: "Services",
      projects: "Projects",
      news: "News",
      importantLinks: "Important Links",
      contact: "Contact",
      startConversation: "Start a Conversation",
      privacy: "Privacy",
      terms: "Terms",
      allRightsReserved: "All rights reserved."
    }
  },
  ar: {
    navbar: {
      companyName: "شركة شمال أفريقيا للاستكشاف الجيوفزيائي المساهمة",
      latestBreakingLabel: "عاجل",
      latestBreakingActionTitle: "الانتقال لآخر الأخبار",
      latestBreakingDefaultTitle: "آخر تحديثات أخبار ناجيكو",
      executionTagline: "تنفيذ جيوفيزيائي جاهز ميدانيًا",
      requestConsultation: "اطلب استشارة",
      navItems: [
        { href: "/", label: "الرئيسية" },
        {
          href: "/about",
          label: "عن الشركة",
          children: [
            { href: "/about", label: "من نحن" },
            { href: "/gallery", label: "المعرض" },
            { href: "/capabilities", label: "القدرات" },
            { href: "/industries", label: "القطاعات" },
            { href: "/about/organizational-structure", label: "الهيكل التنظيمي" },
            { href: "/about/hive-chart", label: "مخطط الخلية" },
            { href: "/about/site-map", label: "هيكل الموقع" }
          ]
        },
        { href: "/services", label: "الخدمات" },
        { href: "/career", label: "الوظائف" },
        { href: "/partner", label: "العملاء" },
        {
          href: "/operations",
          label: "العمليات",
          children: [
            { href: "/crew", label: "الطواقم" },
            { href: "/projects", label: "المشاريع" }
          ]
        },
        { href: "/news", label: "الأخبار" },
        { href: "/related-links", label: "روابط ذات صلة" },
        { href: "/our-team", label: "فريقنا" },
        { href: "/tender", label: "المناقصات" },
        { href: "/hse", label: "السلامة" },
        { href: "/contact", label: "اتصل بنا" }
      ]
    },
    footer: {
      trustedTitle: "تنفيذ ميداني موثوق مع رؤية أوضح لما تحت السطح.",
      quickLinks: "روابط سريعة",
      about: "من نحن",
      services: "الخدمات",
      projects: "المشاريع",
      news: "الأخبار",
      importantLinks: "روابط مهمة",
      contact: "تواصل معنا",
      startConversation: "ابدأ تواصلًا",
      privacy: "الخصوصية",
      terms: "الشروط",
      allRightsReserved: "جميع الحقوق محفوظة."
    }
  }
};

export function getI18nMessages(locale: SiteLocale): I18nMessages {
  return messages[locale];
}
