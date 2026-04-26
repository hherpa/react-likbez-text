# Prototypes

Это прототипы демонстрируют функциональность, которую компонент `LikbezText` должен предоставлять "из коробки" через свой API.

## Файлы

- **textarea-example.html** — Простой редактор с `<textarea>`
- **codemirror-example.html** — Редактор с CodeMirror (подсветка синтаксиса Markdown)

## Назначение

Эти прототипы показывают, какие возможности должен поддерживать компонент:

1. **Ввод текста** — редактор с live preview
2. **Markdown** — заголовки (h1-h3), жирный, курсив, код
3. **KaTeX** — inline (`$...$`) и display (`$$...$$`) формулы
4. **Siglum** — полноценные LaTeX блоки через `{siglum}...{/siglum}`

Прототипы — это не часть библиотеки, а визуальные демонстрации ожидаемого поведения API компонента.

## Запуск

```bash
node server.js
```

Затем открыть:
- `http://localhost:3001/textarea-example.html`
- `http://localhost:3001/codemirror-example.html`