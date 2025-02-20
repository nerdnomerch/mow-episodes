import { SPRITE_OPTIONS } from "../config/constants";
import { socket } from "../services/socket";

export function createCharacterSelect() {
  return new Promise((resolve) => {
    const nameForm = document.createElement("div");
    nameForm.style.position = "absolute";
    nameForm.style.top = "50%";
    nameForm.style.left = "50%";
    nameForm.style.transform = "translate(-50%, -50%)";
    nameForm.style.textAlign = "center";
    nameForm.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    nameForm.style.padding = "20px";
    nameForm.style.borderRadius = "10px";

    // Name input
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your name";
    input.style.padding = "10px";
    input.style.marginBottom = "20px";
    input.style.display = "block";
    input.style.width = "200px";

    // Sprite selection
    const spriteDiv = document.createElement("div");
    spriteDiv.style.marginBottom = "20px";

    SPRITE_OPTIONS.forEach((sprite, index) => {
      const container = document.createElement("div");
      container.style.marginBottom = "10px";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.gap = "10px";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "spriteChoice";
      radio.value = sprite.id;
      radio.id = sprite.id;
      radio.checked = index === 0; // First option selected by default

      const label = document.createElement("label");
      label.htmlFor = sprite.id;
      label.textContent = sprite.label;
      label.style.color = "white";

      // Create a container for the sprite preview
      const previewContainer = document.createElement("div");
      previewContainer.style.width = "48px";
      previewContainer.style.height = "48px";
      previewContainer.style.overflow = "hidden";
      previewContainer.style.position = "relative";

      const preview = document.createElement("img");
      preview.src = `assets/${sprite.id}.png`;
      preview.style.position = "absolute";
      preview.style.left = "0";
      preview.style.top = "0";
      preview.style.width = "288px"; // Full spritesheet width (48 * 6)
      preview.style.height = "384px"; // Full spritesheet height
      preview.style.imageRendering = "pixelated";
      preview.style.clipPath = "inset(0 240px 336px 0)"; // Clip to show only first frame
      preview.style.transform = "scale(1)"; // Adjust if needed

      previewContainer.appendChild(preview);

      container.appendChild(radio);
      container.appendChild(previewContainer);
      container.appendChild(label);
      spriteDiv.appendChild(container);
    });

    const button = document.createElement("button");
    button.textContent = "Join Game";
    button.style.padding = "10px 20px";

    nameForm.appendChild(input);
    nameForm.appendChild(spriteDiv);
    nameForm.appendChild(button);
    document.body.appendChild(nameForm);

    button.onclick = () => {
      const selectedSprite = document.querySelector(
        'input[name="spriteChoice"]:checked'
      ).value;
      const playerName = input.value.trim() || "Player";
      document.body.removeChild(nameForm);

      // Emit both name and sprite choice
      socket.emit("playerData", { name: playerName, spriteId: selectedSprite });
      resolve({ playerName, selectedSprite });
    };
  });
}
