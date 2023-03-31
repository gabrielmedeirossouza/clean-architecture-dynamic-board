export type TextureResponse = {
  width: number
  height: number
  image: HTMLImageElement
}

export class Loader
{
	public static LoadTexture(location: string): Promise<TextureResponse>
	{
		const texture = new Promise<TextureResponse>((resolve, reject) =>
		{
			const image = new Image();
			image.src = location;

			image.addEventListener('load', () =>
			{
				const canvas = document.createElement('canvas');
				canvas.width = image.naturalWidth;
				canvas.height = image.naturalHeight;
				const context = canvas.getContext('2d')!;
				context.scale(1, -1);
				context.drawImage(image, 0, -image.naturalHeight);
				const invertedImage = new Image();
				invertedImage.src = canvas.toDataURL();

				resolve({
					width: image.naturalWidth,
					height: image.naturalHeight,
					image: invertedImage,
				});
			});

			image.addEventListener("error", () =>
			{
				reject(new Error('Failed to load texture'));
			});
		});

		return texture;
	}
}
