import "../css/Disclaimer.css";

interface DisclaimerProps {
  onClose: () => void;
}

const Disclaimer = ({ onClose }: DisclaimerProps) => {
  return (
    <div className="overlay">
      <div className="disclaimer-modal">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <div className="disclaimer-content">
          <ul>
            <li>
              This system has been developed strictly for academic and research
              purposes to explore the feasibility of signal-based occupancy
              monitoring in public environments. It is part of an academic study
              and is not designed, nor should it be interpreted, as a commercial
              surveillance or monitoring solution.
            </li>

            <li>
              No attempt is made to collect, store, or analyze personal or
              sensitive information. All data utilized is publicly broadcasted
              and readily accessible in the radio spectrum. Encrypted
              communications are not decrypted, intercepted, or processed.
            </li>

            <li>
              The methodology strictly follows ethical research practices,
              prioritizing user privacy and data security at all times. Any
              findings from this research are intended to inform academic
              knowledge and technological development, not to infringe upon
              individual privacy rights.
            </li>
          </ul>
        </div>
        <button className="disclaimer-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
