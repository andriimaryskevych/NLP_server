# Car NLP

Application is build from such parts:
- Frontend: React.js
- Backend: Node.js
- DB: Prolog
- NLP service: Dialog Flow

IMPORTANT NOTE
Used 'swipl' library has an important: in some cases (I don't know exactly when) library breaks on attempt to close query.
Solution for this for me was to delete
```
this.internal.close();
```
on line 55 in index.js from swipl in node modules