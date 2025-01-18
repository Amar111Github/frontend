import React, { useEffect, useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import BatteryStatus from "../../Utils/BatteryStatus";
import BrowserIcon from "../../Utils/BrowserIcon";
import GeoLocation from "../../Utils/GeoLocation";
import CameraModal from "../../Utils/CameraModal";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const formattedTime = currentTime.toLocaleDateString(undefined, options);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  return (
    <div
      style={{ background: "var(--light)" }}
      className="d-flex align-items-center gap-3 p-1 fixed-bottom space-between"
    >
      {/* <span
        className="text-uppercase"
        style={{ fontWeight: "lighter", fontSize: ".9rem" }}
      >
        {formattedTime}
      </span> */}
      {online ? <FiWifi /> : <FiWifiOff />}

      <span>
        <BrowserIcon />
      </span>
      <span>
        <CameraModal />
      </span>
      <span>
        <GeoLocation />
      </span>
      <span>&copy; {new Date().getFullYear()} Kasper Infotech </span>
    </div>
  );
};

export default Footer;
