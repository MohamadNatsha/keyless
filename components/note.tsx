import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

@customElement('note-viewer')
export class NoteViewer extends LitElement {
  public editor?: Editor; // made public

  static styles = css`
    .editor {
      min-height: 150px;
      height: 100%;
      overflow: hidden;
      outline: none;
    }

    .tiptap {
      outline: none;
    }

    /* Show placeholder if first child under .editor is empty */
    .tiptap > :first-child:has(br)::before {
      content: 'Start writing here...';
      color: #aaa;
      pointer-events: none;
      font-style: italic;
    }

    /* Show placeholder in .title if empty */
    .title:empty::before {
      content: 'Untitled';
      color: #aaa;
      pointer-events: none;
      font-style: italic;
    }
  `;

  firstUpdated() {
    console.log(this.renderRoot);
    const editorContainer = this.renderRoot.querySelector('#editor') as HTMLElement;

    // Prevent Enter from creating a new line in the title
    const titleDiv = this.renderRoot.querySelector('.title');
    if (titleDiv) {
      // Prevent Enter from creating a new line
      titleDiv.addEventListener('keydown', function(event: Event) {
        const e = event as KeyboardEvent;
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });

      // Remove <br> if that's the only content, so :empty works
      titleDiv.addEventListener('input', () => {
        if (
          titleDiv.innerHTML === '<br>' ||
          titleDiv.innerHTML === '<br/>' ||
          titleDiv.innerHTML === '<br />'
        ) {
          titleDiv.innerHTML = '';
        }
      });
    }

    this.editor = new Editor({
      element: editorContainer,
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        BulletList,
        OrderedList
      ],
      content: '<p></p>',
    });
  
  }

  disconnectedCallback() {
    this.editor?.destroy();
    super.disconnectedCallback();
  }

  public getEditor() {
    return this.editor;
  }

  render() {
    return html`
    <div style="padding: 12px;">
      <div class="title" style="font-size: 24px; font-weight: bold; outline: none; white-space: nowrap;" contenteditable="true"></div>  
      <div class="editor" id="editor">
      </div>
    </div>
   `;
  }
}