import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Yue-Skinner Dominique",
    designation: "App Developer",
    image: "/images/team/team-00.png",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 2,
    name: "Gajjar Hiren",
    designation: "App Developer",
    image: "/images/team/team-00.png",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 3,
    name: "Sanchen Zhang",
    designation: "App Developer",
    image: "/images/team/team-00.png",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
 
];

const Team = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Our Team"
            title="Meet Our Team"
            paragraph="Our team is made up of passionate individuals, each bringing their unique skills and experiences to the table. We work collaboratively to build meaningful and innovative solutions that make a difference."
            width="640px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team, i) => (
            <SingleTeam key={i} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
