import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[540px] lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                  Stay Connected, Cherish Every Moment with Family Connect
                </h2>
                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  Family Connect is a social family management platform designed to bring families closer together.
                  Whether it’s sharing memorable moments, planning family events, or keeping track of important milestones,
                  Family Connect provides a warm and secure space for every member to stay engaged.
                  <br /> <br />
                  With easy-to-use features like private posts, event planning, and photo albums,
                  Family Connect ensures that families can celebrate together no matter where they are.
                </p>
              </div>

            </div>
            <div className="w-full px-4 lg:w-1/2 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-6 sm:gap-4">

              <div className="w-full sm:w-1/2 lg:w-full xl:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[500px]">
                <Image
                  src="/images/about/about-3.jpg"
                  alt="About image"
                  fill
                  className="h-full w-full object-cover object-center rounded-lg"
                />
              </div>


              <div className="w-full sm:w-1/2 lg:w-full xl:w-1/2 flex flex-col gap-4">

                <div className="relative h-[60%] sm:h-[70%] lg:h-[65%] xl:h-[70%]">
                  <Image
                    src="/images/about/about-1.jpg"
                    alt="About image"
                    fill
                    className="h-full w-full object-cover object-center rounded-lg"
                  />
                </div>


                <div className="relative h-[40%] sm:h-[30%] lg:h-[35%] xl:h-[30%]">
                  <Image
                    src="/images/about/about-2.jpg"
                    alt="About image"
                    fill
                    className="h-full w-full object-cover object-center rounded-lg"
                  />
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
