import { useState } from "react";
import { createWorker } from "tesseract.js";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [textLines, setTextLines] = useState<string[]>([]);

  const handleImageSelection = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImage(url);

      (async () => {
        const worker = await createWorker("eng");
        const ret = await worker.recognize(url);
        console.log(ret.data.text);
        setTextLines(ret.data.text.split("\n"));
        await worker.terminate();
      })();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-start gap-4 p-24 bg-neutral-950 text-white">
      <div className="flex-1 flex flex-col items-center gap-4 p-4 bg-white/10 rounded">
        <input
          type="file"
          name="ocr_image"
          id="image"
          onChange={handleImageSelection}
        />

        {image && (
          <img
            src={image}
            alt="preview image"
            className="w-full h-auto rounded"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col items-start p-4 gap-4 bg-white/10 rounded">
        <h3>Text form the image</h3>
        <div>
          {textLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </main>
  );
}
