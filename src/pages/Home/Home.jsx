import React from "react";
import images from "../../images/images";
import Avatar from "@mui/material/Avatar";
import { deepOrange, blue, green } from "@mui/material/colors";
import "./home.css";

export default function Home() {
  let { lockIcon,moreIcon } = images;

  return (
    <div className=" dflex jcontentSpaceBet bCWhite mt2 minHeight5 alingItems p1">
      <div className="dflex gap15 p1 alingItems">
        <div className="mc-buttonPrivate">
          <img
            src={lockIcon}
            className="mc-buttonPrivateAppsIcon"
            alt="appicons"
          />
          <p className="mc-buttonPrivateAppsIcon-p">Private</p>
        </div>

        <Avatar
          sx={{ bgcolor: blue[500], width: 27, height: 27 }}
          variant="rounded"
        >
          M
        </Avatar>
        <Avatar
          sx={{ bgcolor: green[500], width: 27, height: 27 }}
          variant="rounded"
        >
          J
        </Avatar>
        <Avatar sx={{ width: 27, height: 27 }} variant="rounded">
          G
        </Avatar>
        <Avatar sx={{ width: 27, height: 27 }} variant="rounded">
          A
        </Avatar>
        <Avatar
          sx={{ bgcolor: deepOrange[500], width: 27, height: 27 }}
          variant="rounded"
          className="showMenuAvatar"
        >
          +
        </Avatar>
      </div>
      <div className="mc-buttonPrivate m1">
          <img
            src={moreIcon}
            className="mc-buttonPrivateAppsIcon"
            alt="appicons"
          />
          <p className="mc-buttonPrivateAppsIcon-p">Show Menu</p>
      </div>
    </div>
  );
}
