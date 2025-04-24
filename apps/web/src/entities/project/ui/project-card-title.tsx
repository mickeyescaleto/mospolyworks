type ProjectCardTitleProps = {
  title: string;
};

export function ProjectCardTitle({ title }: ProjectCardTitleProps) {
  return (
    <p className="text-foreground text-start text-base leading-tight font-medium">
      {title}
    </p>
  );
}
