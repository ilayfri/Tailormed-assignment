import "./App.css";
import ProgramsList from "./components/programsList/ProgramsList";
import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react/cjs/react.development";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);
function App() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    socket.emit("requestDBData");
    socket.on("sendDBData", (data) => {
      setPrograms(data);
    });
  }, []);

  useEffect(() => {
    socket.on("dbUpdate", (updateEvent) => {
      if (programs.length > 0) {
        let updateProgram = programs.filter(
          (program) => program._id === updateEvent.documentKey._id
        )[0];
        if (updateEvent.operationType === "replace") {
          updateProgram = { ...updateEvent.fullDocument };
        } else if (updateEvent.operationType === "update") {
          updateProgram = {
            ...updateProgram,
            ...updateEvent.updateDescription.updatedFields,
          };
        }
        setPrograms(
          programs.map((program) => {
            if (program._id == updateProgram._id) {
              return updateProgram;
            } else {
              return program;
            }
          })
        );
      }
    });
  }, [programs]);
  return (
    <div className="App">
      <div className="programs-div">
      <div className="title">
          <h1>Programs updates</h1>
          <h4>Tailormed home assignment</h4>
      </div>
        <ProgramsList programs={programs} />
      </div>
      <div></div>
    </div>
  );
}

export default App;
