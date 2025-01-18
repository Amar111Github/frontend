import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { ImPhoneHangUp } from "react-icons/im";
import { MdCameraEnhance } from "react-icons/md";
// import Position from '../Pages/Department/Position';

const CameraModal = () => {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const handleShowModal = () => {
    setShowModal(true);
    startCamera();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    stopCamera();
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <>
      <button
        title="Open Mirror"
        className="btn p-0 text-white d-flex my-auto "
        onClick={handleShowModal}
      >
        <MdCameraEnhance style={{ color: "black", marginTop: "11px" }} />
      </button>
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <div
          className="video-container"
          style={{ height: "450px", width: "600px", position: "relative" }}
        >
          <video ref={videoRef} width="100%" height="100%" autoPlay />
          <button
            title="Hang Up"
            className="close-btn btn btn-danger"
            onClick={handleCloseModal}
          >
            <ImPhoneHangUp />
          </button>
        </div>
      </Modal>
      <style jsx>{`
        .video-container {
          position: relative;
        }
        .close-btn {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: none;
        }
        .video-container:hover .close-btn {
          display: block;
        }
      `}</style>
    </>
  );
};

export default CameraModal;
