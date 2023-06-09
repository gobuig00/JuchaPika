import React from "react";
import Hls from "hls.js";
import "video.js/dist/video-js.css";
import AWS from "aws-sdk";
import play from "../../assets/play.png";
import styles from "./LivePage.module.css";

const MediaViewer = () => {
  const hlsPlayerRef = React.useRef();

  const startPlayback = () => {
    // Step 1: Configure SDK Clients
    const options = {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_KEY,
      region: process.env.REACT_APP_REGION,
    };

    const kinesisVideo = new AWS.KinesisVideo(options);
    const kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(
      options
    );
    // Step 2: Get a data endpoint for the stream
    kinesisVideo.getDataEndpoint(
      {
        StreamName: process.env.REACT_APP_STREAM_NAME,
        APIName: "GET_HLS_STREAMING_SESSION_URL",
      },
      (err, response) => {
        if (err) {
          return console.error(err);
        }
        kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(
          response.DataEndpoint
        );

        // Step 3: Get a Streaming Session URL
        kinesisVideoArchivedContent.getHLSStreamingSessionURL(
          {
            StreamName: process.env.REACT_APP_STREAM_NAME,
            PlaybackMode: "LIVE",
            HLSFragmentSelector: {
              FragmentSelectorType: "SERVER_TIMESTAMP",
              TimestampRange: undefined,
            },
            ContainerFormat: "MPEG_TS",
            DiscontinuityMode: "NEVER",
            DisplayFragmentTimestamp: "ALWAYS",
            MaxMediaPlaylistFragmentResults: null,
            Expires: null,
          },
          (err, response) => {
            if (err) {
              return console.error(err);
            }

            // Step 4: Give the URL to the video player.

            const playerElement = hlsPlayerRef.current;
            const player = new Hls();
            player.loadSource(response.HLSStreamingSessionURL);
            player.attachMedia(playerElement);
            player.on(Hls.Events.MANIFEST_PARSED, () => {
              playerElement.play();
            });
          }
        );
      }
    );
    const playbackButtonWrapper = document.getElementById(
      "playback-button-wrapper"
    );
    playbackButtonWrapper.style.display = "none";
  };

  return (
    <div style={{ position: "relative" ,marginRight:"8%"  }}>
      <div>
        <video
          ref={hlsPlayerRef}
          controls
          style={{ width: "152%", display: "block"}}
        />
      </div>
      <div
        id="playback-button-wrapper"
        style={{ position: "absolute", top: "44%", left: "71%" }}
      >
        <div onClick={startPlayback}>
          <img src={play} alt="재생 시작" width="30%" className={styles.video}/>
        </div>
      </div>
    </div>
  );
};
export default MediaViewer;
