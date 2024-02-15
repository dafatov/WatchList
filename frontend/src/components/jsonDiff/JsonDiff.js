// eslint-disable-next-line import/no-unresolved
import 'jsondiffpatch/formatters/styles/html.css';
import {FormControlLabel, Switch} from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import {format, hideUnchanged, showUnchanged} from 'jsondiffpatch/formatters/html';
import {memo, useEffect, useMemo, useState} from 'react';
import {diff} from 'jsondiffpatch';
import {useStyles} from './jsonDiffStyles';
import {useTranslation} from 'react-i18next';

export const JsonDiff = memo(({
  previous,
  current,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [hasUnchanged, setHasUnchanged] = useState(false);

  useEffect(() => {
    if (hasUnchanged) {
      showUnchanged();
    } else {
      hideUnchanged();
    }
  }, [hideUnchanged, showUnchanged, hasUnchanged]);

  const delta = useMemo(() => diff(previous, current), [diff, previous, current]);
  const innerHtml = useMemo(() => ({__html: format(delta, previous)}), [format, delta, previous]);

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            checked={hasUnchanged}
            onChange={e => setHasUnchanged(e.target.checked)}
          />
        }
        label={t('common:action.showUnchanged')}
        className={classes.formControlLabel}
      />
      <div className={classes.differenceRoot}>
        <div className="json-diff-container">
          <div dangerouslySetInnerHTML={innerHtml}/>
        </div>
      </div>
    </div>
  );
});

JsonDiff.displayName = 'JsonDiff';
