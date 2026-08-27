import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-8">
        <SocialLinks variant="icon" />
      </div>
    </footer>
  );
}
