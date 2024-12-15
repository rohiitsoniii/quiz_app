import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Congrets.css";

const Congrets = ({ onClose, shareLink, question_type }) => {
  const handleClose = () => {
    onClose();
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Error copying link to clipboard");
      });
  };

  return (
    <div className="popup_creat">
      <div className="pop_cong">
        <div className="cancle_share_btn_div">
          <img src="./cancle.svg" alt="" height={20} onClick={handleClose} />
        </div>
        <div className="cong_text_share">
          <p className="cong">
            Congrats your {question_type} is
            <br />
            Published!
          </p>
          <input
            type="text"
            value={shareLink}
            placeholder="your link is here"
            className="congrets_input"
            disabled
          />
          <div className="share_btn_cong_div">
            <button className="share_btn_cong" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congrets;
