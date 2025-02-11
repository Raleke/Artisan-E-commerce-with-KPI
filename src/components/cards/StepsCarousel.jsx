import { Card, CardBody, CardHeader } from "@heroui/react";
export default function StepsCarousel({ steps }) {
  return (
    <div className="flex flex-wrap -mt-0 -mx-2">
      {steps.map((step) => (
        <div
          className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 mt-2 min-h-32"
          key={step.id}
        >
          <Card className="min-h-80">
            <CardHeader className="flex justify-center">
              <img
                src={step.icon}
                alt="icon"
                className="w-22 h-32 mt-5 mb-10"
              />
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <span>step {step.id}</span>
                <h3 className="text-2xl text-primary">{step.title}</h3>
              </div>
              <p>{step.description}</p>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}
