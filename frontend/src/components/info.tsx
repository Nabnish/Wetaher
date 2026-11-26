

const NAME = "Nabeel Pasha";
const LINKEDIN = "https://www.linkedin.com/in/nabeel-pasha-03156036b/";
const COMPANY_LINKEDIN = "https://www.linkedin.com/school/pmaccelerator/home/";
const COMPANY_WEBSITE = "https://www.pmaccelerator.io/";

const OVERVIEW = [
    "The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped hundreds of students fulfill their career aspirations.",
    "Our Product Manager Accelerator community is ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.",
];

const SERVICES = [
    { name: "PMA Pro", text: "End-to-end product manager job hunting program with mock interviews and job referrals through our alumni network." },
    { name: "AI PM Bootcamp", text: "Hands-on AI product management by building a real AI product with a team of AI engineers, data scientists, and designers." },
    { name: "PMA Power Skills", text: "For existing product managers who want to sharpen product, leadership, and executive presentation skills." },
    { name: "PMA Leader", text: "Accelerates product management careers toward Director and product executive levels." },
    { name: "1:1 Resume Review", text: "Rewrites your product manager resume to stand out, with an interview guarantee." },
];

export default function Info() {
    return (
        <>
            <div className="bg-blue-500 p-6">

                <div>
                    <p className="text-xs uppercase tracking-wide text-white">Built by</p>
                    <h2 className="text-lg text-white font-semibold">{NAME}</h2>
                    <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-300 ">
                        LinkedIn profile
                    </a>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-wide text-white">About Product Manager Accelerator</p>
                    {OVERVIEW.map((paragraph) => (

                        <p key={paragraph} className="text-sm leading-relaxed text-white">
                            {paragraph}

                        </p>

                    ))}
                </div>

                <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-white">Services</p>
                    <ul className="flex flex-col gap-2 text-sm text-white">


                        {SERVICES.map((service) => (
                            <li key={service.name}>

                                <span className="font-semibold text-white">{service.name}:</span> {service.text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white">
                    <span>Boston, MA · Founded 2020</span>

                    <a href={COMPANY_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-red-300">
                        Company LinkedIn
                    </a>
                    <a href={COMPANY_WEBSITE} target="_blank" rel="noopener noreferrer" className="text-red-300">
                        Website
                    </a>
                </div>
            </div>

        </>
    );
}