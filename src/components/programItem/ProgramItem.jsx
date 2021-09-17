import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProgramItem.css";
const ProgramItem = (props) => {
  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{props.itemName}</Accordion.Header>
          <Accordion.Body>
            <div>
              <span>
                <b>Status:</b>
              </span>
              <span> {props.status}</span>
            </div>
            <div>
              <span>
                <b>Maximum Award Level:</b>
              </span>
              <span> {props.MAL}</span>
            </div>
            <div>
              <span>
                <b>Treatments Covered ({props.TreatmentsCovered.length}): </b>
              </span>
              <span>
                {props.TreatmentsCovered.map((item, index) =>
                  index + 1 !== props.TreatmentsCovered.length
                    ? item + ", "
                    : item
                )}
              </span>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ProgramItem;
