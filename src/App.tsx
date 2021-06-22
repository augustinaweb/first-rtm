import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AgoraRTM from "agora-rtm-sdk";

const App = () => {
  /// Params for login
  let options = {
    uid: "baba",
    token: "00641fafc63a2ab41fcb5e9fb3b24e64ad1IADwWOHho5YdXPeOnJwXnW5++lv7ED+8kFiDM8giY9QY2KwhLsMAAAAAEACKAV218GLTYAEA6APwYtNg",
  };

  //// Your app ID
  const appID = "41fafc63a2ab41fcb5e9fb3b24e64ad1";
  //// Your token
  options.token =
    "00641fafc63a2ab41fcb5e9fb3b24e64ad1IADwWOHho5YdXPeOnJwXnW5++lv7ED+8kFiDM8giY9QY2KwhLsMAAAAAEACKAV218GLTYAEA6APwYtNg";
  ////app.certificate = "5163128debde47929cc70fbd0902b008"

  //// Initialize client
  const client = AgoraRTM.createInstance(appID);

  //// Client Event listeners
  // Display messages from peer
  client.on("MessageFromPeer", function (message, peerId) {
    document
      .getElementById("log")
      ?.appendChild(document.createElement("div"))
      .append("Message from: " + peerId + " Message: " + message);
  });

  //// Display connection state changes
  client.on("ConnectionStateChanged", function (state, reason) {
    document
      .getElementById("log")
      ?.appendChild(document.createElement("div"))
      .append("State changed To: " + state + " Reason: " + reason);
  });

  let channel = client.createChannel("demoChannel");

  channel.on("ChannelMessage", function (message, memberId) {
    document
      .getElementById("log")
      ?.appendChild(document.createElement("div"))
      .append("Message received from: " + memberId + " Message: " + message);
  });

  //// Display channel member stats
  channel.on("MemberJoined", function (memberId) {
    document
      .getElementById("log")
      ?.appendChild(document.createElement("div"))
      .append(memberId + " joined the channel");
  });

  //// Display channel member stats
  channel.on("MemberLeft", function (memberId) {
    document
      .getElementById("log")
      ?.appendChild(document.createElement("div"))
      .append(memberId + " left the channel");
  });

  //// Button behavior
  window.onload = function () {
    // Buttons
    // login
    let login = document.getElementById("login");
    if (login) {
      login.onclick = async function () {
        options.uid = (
          document.getElementById("userID") as HTMLInputElement
        )?.value.toString();
        await client.login(options);
      };
    }
    //  // logout
    let logout = document.getElementById("logout");
    if (logout) {
      logout.onclick = async function () {
        await client.logout();
      };
    }

    //  // create and join channel
    let join = document.getElementById("join");
    if (join) {
      join.onclick = async function () {
        // Channel event listeners
        // Display channel messages
        await channel.join().then(() => {
          let log = document.getElementById("log");
          if (log) {
            log
              .appendChild(document.createElement("div"))
              .append(
                "You have successfully joined channel " + channel.channelId
              );
          }
        });
      };
    }

    // leave channel
    let leave = document.getElementById("leave");
    if (leave) {
      leave.onclick = async function () {
        if (channel != null) {
          await channel.leave();
        } else {
          console.log("Channel is empty");
        }
      };
    }

    // send peer-to-peer message
    let sendPeerMessage = document.getElementById("send_peer_message");
    if (sendPeerMessage) {
      sendPeerMessage.onclick = async function () {
        let peerId = (
          document.getElementById("peerId") as HTMLInputElement
        )?.value.toString();
        let peerMessage = (
          document.getElementById("peerMessage") as HTMLInputElement
        ).value.toString();

        await client
          .sendMessageToPeer({ text: peerMessage }, peerId)
          .then((sendResult) => {
            if (sendResult.hasPeerReceived) {
              document
                .getElementById("log")
                ?.appendChild(document.createElement("div"))
                .append(
                  "Message has been received by: " +
                    peerId +
                    " Message: " +
                    peerMessage
                );
            } else {
              document
                .getElementById("log")
                ?.appendChild(document.createElement("div"))
                .append(
                  "Message sent to: " + peerId + " Message: " + peerMessage
                );
            }
          });
      };
    }
    // send channel message
    let sendChannelMessage = document.getElementById("send_channel_message");
    if (sendChannelMessage) {
      sendChannelMessage.onclick = async function () {
        let channelMessage = (
          document.getElementById("channelMessage") as HTMLInputElement
        )?.value.toString();

        if (channel != null) {
          await channel.sendMessage({ text: channelMessage }).then(() => {
            document
              .getElementById("log")
              ?.appendChild(document.createElement("div"))
              .append(
                "Channel message: " +
                  channelMessage +
                  " from " +
                  channel.channelId
              );
          });
        }
      };
    }
  };

  return (
    <>
      <h2 className="left-align">RTM Quickstart</h2>
      <form id="loginForm">
        <div className="col" style={{ minWidth: "433px", maxWidth: "443px" }}>
          <div
            className="card"
            style={{ marginTop: "0px", marginBottom: "0px" }}
          >
            <div
              className="row card-content"
              style={{ marginBottom: "0px", marginTop: "10px" }}
            >
              <div className="input-field">
                <label>User ID</label>
                <input type="text" placeholder="User ID" id="userID" />
              </div>
              <div className="row">
                <div>
                  <button type="button" id="login">
                    LOGIN
                  </button>
                  <button type="button" id="logout">
                    LOGOUT
                  </button>
                </div>
              </div>
              <div className="input-field">
                <label>Channel name: demoChannel</label>
              </div>
              <div className="row">
                <div>
                  <button type="button" id="join">
                    JOIN
                  </button>
                  <button type="button" id="leave">
                    LEAVE
                  </button>
                </div>
              </div>
              <div className="input-field channel-padding">
                <label>Channel Message</label>
                <input
                  type="text"
                  placeholder="channel message"
                  id="channelMessage"
                />
                <button type="button" id="send_channel_message">
                  SEND
                </button>
              </div>
              <div className="input-field">
                <label>Peer Id</label>
                <input type="text" placeholder="peer id" id="peerId" />
              </div>
              <div className="input-field channel-padding">
                <label>Peer Message</label>
                <input
                  type="text"
                  placeholder="peer message"
                  id="peerMessage"
                />
                <button type="button" id="send_peer_message">
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default App;
