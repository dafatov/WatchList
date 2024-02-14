// eslint-disable-next-line import/no-unresolved
import 'jsondiffpatch/formatters/styles/html.css';
import {Card, CardContent, TextField} from '@mui/material';
import {memo, useMemo} from 'react';
import {diff} from 'jsondiffpatch';
// eslint-disable-next-line import/no-unresolved
import {format} from 'jsondiffpatch/formatters/html';

//TODO: удалить
export const Test = memo(() => {
  const a = useMemo(() => ({g: ['43', '23']}), []);
  const b = useMemo(() => ({r: '23', g: ['23', 43]}), []);
  const diffP = useMemo(() => {
    return diff(a, b);
  }, [a, b]);

  return (
    <Card>
      <CardContent style={{backgroundColor: '#fff', color: '#000'}}>
        <TextField multiline disabled value={JSON.stringify(diffP, null, 2)}/>
        <div className={'json-diff-container'}>
          <div dangerouslySetInnerHTML={(({__html: format(diffP, a)}) || '')}></div>
        </div>
      </CardContent>
    </Card>
  );

});

Test.displayName = 'Test';
