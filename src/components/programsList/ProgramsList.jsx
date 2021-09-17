import ProgramItem from "../programItem/ProgramItem";
const ProgramsList = (props) => {
  return (
    <>
      {props.programs.map((item) => {
        return (
          <ProgramItem
            key={item._id}
            itemName={item.ProgramName}
            status={item.Status}
            MAL={item.MAL}
            TreatmentsCovered={item.TreatmentsCovered}
          />
        );
      })}
    </>
  );
};

export default ProgramsList;
