import { Editor, EditorOutput } from '@/components/editor';

const RootPage = () => {
  return (
    <>
      <section>
        <Editor />
      </section>
      <section>
        <EditorOutput
          data={{
            blocks: [
              {
                id: 'mhTl6ghSkV',
                type: 'paragraph',
                data: {
                  text: 'Hey. Meet the new Editor. On this picture you can see it in action. Then, try a demo 🤓',
                },
              },
              {
                id: 'mhTl6ghSkF',
                type: 'header',
                data: {
                  text: 'Header 2',
                  level: 2,
                },
              },
            ],
          }}
        />
      </section>
    </>
  );
};

export default RootPage;
