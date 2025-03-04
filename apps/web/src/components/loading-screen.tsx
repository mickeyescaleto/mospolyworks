import Image from 'next/image';

export function LoadingScreen() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="relative size-24">
        <Image
          src="brand.svg"
          alt="Brand"
          fill
          priority
          draggable={false}
          className="animate-spin select-none dark:invert"
        />
      </div>
    </main>
  );
}
