import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

const formatUpdater = (value) => {
  if (value == null) return '';
  const asNumber = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(asNumber)) return String(value);
  const ms = asNumber < 1e12 ? asNumber * 1000 : asNumber;
  const diff = Date.now() - ms;
    if (diff < 60_000) return 'mniej niż minutę temu';
    return formatDistanceToNow(new Date(ms), { addSuffix: true, locale: pl });
};

export default formatUpdater;