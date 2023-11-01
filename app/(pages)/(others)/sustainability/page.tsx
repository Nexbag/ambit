import { COMPANYNAME } from "@/app/components/js/config";
import styles from "../style.module.scss";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
export default function Page() {
  const data: TopperType = {
    title: "Sustainability: Nurturing a Greener Tomorrow",
    text: [
      "We believe in harnessing the power of cryptocurrency mining while staying mindful of our responsibility to the environment and future generations. Our commitment to sustainability is at the heart of everything we do, shaping our practices, policies, and investments. Join us in our journey towards a greener and more sustainable future.",
    ],
   
  };
  const texts: { title: string; text: string[] }[] = [
    {
      title: "Our Sustainability Principles",
      text: [
        `1. Energy Efficiency: We continuously strive to improve the energy efficiency of our mining operations. By investing in the latest, most energy-efficient technologies and practices, we reduce our carbon footprint while maximizing mining output.`,
        `2. Renewable Energy: We actively explore partnerships with renewable energy providers to power our mining operations. Utilizing clean and sustainable energy sources aligns with our vision for a more eco-friendly future.`,
        `3. Responsible Resource Management: We are committed to the responsible management of resources, including electronic waste disposal, recycling, and responsible sourcing of hardware components.`,
        `4. Transparency and Reporting: We maintain transparency in our sustainability efforts and regularly report on our progress. We believe that accountability is essential in achieving meaningful change.`,
      ],
    },
    {
      title: "Environmental Impact Mitigation",
      text: [
        `1. Carbon Footprint Reduction: Amber Trade is dedicated to reducing its carbon emissions. We employ energy-efficient hardware, optimize cooling systems, and transition to renewable energy sources whenever feasible.`,
        `2. E-Waste Management: As responsible stewards of the environment, we ensure proper disposal and recycling of electronic waste generated in our operations, minimizing the impact on landfills.`,
        `3. Sustainable Growth: Our growth strategy is aligned with sustainability principles. We expand our operations thoughtfully, taking into account the environmental impact and scalability of our resources.`,
      ],
    },
    {
      title: "Community and Industry Engagement",
      text: [
        `1. Education and Advocacy: Amber Trade actively engages with our community and the cryptocurrency industry to promote sustainable practices. We believe that education and advocacy are vital in driving change across the sector.`,
        `2. Collaboration: We seek partnerships and collaborations with like-minded organizations, governments, and institutions to advance sustainability initiatives and promote responsible practices within the industry.`,
      ],
    },
  ];
  return (
    <main>
      <Topper data={data} />
      <div className={styles.main}>
        <div className={styles.container}>
          {texts.map((e, i) => (
            <div key={i}>
              <h3>{e.title}</h3>
              {e.text.map((k, j) => (
                <p key={j}>{k}</p>
              ))}
            </div>
          ))}
          <p>
            {`At Amber Trade, sustainability isn't just a buzzword; it's a fundamental part of our identity. We invite you to be a part of our mission to create a sustainable and eco-conscious future. Together, we can harness the power of cryptocurrency mining while minimizing our environmental impact.`}
          </p>
        </div>
      </div>
    </main>
  );
}
