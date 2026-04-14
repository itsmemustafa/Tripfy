import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./SharePlanModal.css";


const SharePlanModal = ({ planId, planTitle, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${window.location.origin}/shared/plan/${planId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${planTitle}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>Share Your Plan</h2>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="share-modal-content">
          <div className="share-preview">
            <div className="share-icon">Share</div>
            <h3>{planTitle}</h3>
            <p>Anyone with this link can view your plan</p>
          </div>

          <div className="share-link-section">
            <label>Shareable Link</label>
            <div className="link-input-group">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="link-input"
              />
              <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={copyToClipboard}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="share-divider">
            <span>OR</span>
          </div>

          <div className="qr-section">
            <button
              className="qr-toggle-btn"
              onClick={() => setShowQR(!showQR)}
            >
              {showQR ? "Hide" : "Show"} QR Code
            </button>

            {showQR && (
              <div className="qr-container">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    id="qr-code"
                    value={shareUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-description">
                  Scan this QR code to view the plan
                </p>
                <button className="btn btn-secondary" onClick={downloadQR}>
                  Download QR Code
                </button>
              </div>
            )}
          </div>

          <div className="share-tips">
            <h4>Sharing Tips</h4>
            <ul>
              <li>
                Shared plans are <strong>view-only</strong>
              </li>
              <li>Recipients can create their own copy if logged in</li>
              <li>Link remains active as long as the plan exists</li>
            </ul>
          </div>
        </div>

        <div className="share-modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePlanModal;
