// List of streams
const streams = [
  {
    name: "Model Guest House",
    id: "7014459821",
    rtmp: "rtmp://34.171.159.162/live/7014459821",
    hls: "/hls/7014459821.m3u8",
  },
  {
    name: "Kummari Palem",
    id: "7031194782",
    rtmp: "rtmp://34.171.159.162/live/7031194782",
    hls: "/hls/7031194782.m3u8",
  },
  {
    name: "Sitara Centre Junction",
    id: "7058811443",
    rtmp: "rtmp://34.171.159.162/live/7058811443",
    hls: "/hls/7058811443.m3u8",
  },
  {
    name: "Milk Project",
    id: "7086625914",
    rtmp: "rtmp://34.171.159.162/live/7086625914",
    hls: "/hls/7086625914.m3u8",
  },
  {
    name: "VG Chowk",
    id: "7104493275",
    rtmp: "rtmp://34.171.159.162/live/7104493275",
    hls: "/hls/7104493275.m3u8",
  },
  {
    name: "BRTS Road (Parking)",
    id: "7123368896",
    rtmp: "rtmp://34.171.159.162/live/7123368896",
    hls: "/hls/7123368896.m3u8",
  },
  {
    name: "Railway Station",
    id: "7142290087",
    rtmp: "rtmp://34.171.159.162/live/7142290087",
    hls: "/hls/7142290087.m3u8",
  },
  {
    name: "Bus Stand",
    id: "7161147728",
    rtmp: "rtmp://34.171.159.162/live/7161147728",
    hls: "/hls/7161147728.m3u8",
  },
  {
    name: "Seethamma Vari Paadalu",
    id: "7189076619",
    rtmp: "rtmp://34.171.159.162/live/7189076619",
    hls: "/hls/7189076619.m3u8",
  },
];


function createStreamCard(stream) {
  const card = document.createElement("article");
  card.className = "card";

  // Header
  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = stream.name;

  const id = document.createElement("div");
  id.className = "card-id";
  id.textContent = `ID: ${stream.id}`;

  header.appendChild(title);
  header.appendChild(id);

  // Video
  const videoWrapper = document.createElement("div");
  videoWrapper.className = "video-wrapper";

  const video = document.createElement("video");
  video.setAttribute("controls", "controls");
  video.setAttribute("playsinline", "true");
  video.muted = true; // autoplay works better when muted
  video.preload = "metadata";

  videoWrapper.appendChild(video);

  // Footer
  const footer = document.createElement("div");
  footer.className = "card-footer";

  const linkGroup = document.createElement("div");
  linkGroup.className = "link-group";

  const hlsLink = document.createElement("a");
  hlsLink.className = "link-btn";
  hlsLink.href = stream.hls;
  hlsLink.target = "_blank";
  hlsLink.rel = "noopener noreferrer";
  hlsLink.textContent = "Open HLS";

  const rtmpLink = document.createElement("a");
  rtmpLink.className = "link-btn";
  rtmpLink.href = "#";
  rtmpLink.textContent = "Copy RTMP";

  rtmpLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(stream.rtmp)
      .then(() => {
        rtmpLink.textContent = "Copied!";
        setTimeout(() => {
          rtmpLink.textContent = "Copy RTMP";
        }, 1500);
      })
      .catch(() => {
        alert(`RTMP URL:\n${stream.rtmp}`);
      });
  });

  linkGroup.appendChild(hlsLink);
  linkGroup.appendChild(rtmpLink);

  const statusChip = document.createElement("div");
  statusChip.className = "status-chip";
  statusChip.textContent = "Streaming";

  footer.appendChild(linkGroup);
  footer.appendChild(statusChip);

  // Assemble card
  card.appendChild(header);
  card.appendChild(videoWrapper);
  card.appendChild(footer);

  // Initialize HLS playback
  setupHlsForVideo(video, stream.hls);

  return card;
}

function setupHlsForVideo(video, hlsUrl) {
  if (window.Hls && window.Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 30,
    });
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {
        // Autoplay might be blocked; user can press play
      });
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS error", data);
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    // Safari / iOS
    video.src = hlsUrl;
    video.addEventListener("loadedmetadata", () => {
      video.play().catch(() => {});
    });
  } else {
    // Fallback
    video.outerHTML =
      '<div style="padding:12px;font-size:0.8rem;color:#fecaca;">HLS not supported in this browser.</div>';
  }
}

function init() {
  const container = document.getElementById("streams-container");
  streams.forEach((s) => {
    const card = createStreamCard(s);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", init);
