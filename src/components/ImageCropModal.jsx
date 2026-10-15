import { useState, useCallback } from "react";
import { Modal, Button, Space, message } from "antd";
import Cropper from "react-easy-crop";

const ImageCropModal = ({ open, image, onCancel, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Create the actual cropped file
  const createCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      onConfirm(file);
    } catch (e) {
      message.error("Failed to crop image");
      console.error(e);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Crop your profile photo"
      width={520}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={createCroppedImage}>
            Apply
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 360,
          background: "#333",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 13, color: "#6b7280" }}>Zoom</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </Modal>
  );
};

export default ImageCropModal;

// ---- Helper: generate cropped image as a blob ----
const getCroppedImg = async (imageSrc, crop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Use crop size for a square canvas (final avatar)
  const size = Math.min(crop.width, crop.height);

  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.9
    );
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });