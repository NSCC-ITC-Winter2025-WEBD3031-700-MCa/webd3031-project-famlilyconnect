const OfferList = ({ text }: { text: string }) => {
  return (
    <p className="mb-3 text-lg text-body-color dark:text-dark-6 leading-6">
      <span className="font-medium">•</span> {text}
    </p>
  );
};

export default OfferList;