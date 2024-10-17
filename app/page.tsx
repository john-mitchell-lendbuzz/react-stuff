'use client'
import usePollFirehose from './usePollFirehose';

// event_type -> friendly string
const EVENT_TYPE_FRIENDLY_MAP = {
  100: 'Case Status Changed',
  200: 'Updates Added to Case',
  300: 'Case was Repossessed',
  302: 'Case Completed',
  304: 'Case Reopened',
  400: 'Case Added',
  601: 'Accepted Case ',
  603: 'Declined Case',
  700: 'Case Reassigned',
  800: 'Invoice Created',
  801: 'Invoice Item Added',
  811: 'Invoice Sent to Client',
  817: 'Fee Request Added',
  818: 'Fee Request Status Changed',
  1200: 'Document Added',
  1202: 'Document Deleted'
}

/**
 * Convert a Date into a friendly string
 * 
 * @param datetime The date to convert
 * @returns A user friendly date string
 */
function friendlyDateTime(datetime: Date){
  const friendlyDate = (datetime.getMonth() + 1) + '/' + datetime.getDate() + '/' + datetime.getFullYear();
  const hours = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
  const minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
  const seconds = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
  const friendlyTime = `${hours}:${minutes}:${seconds}`;
  return `${friendlyTime} ${friendlyDate}`;
}

/**
 * Create an RDN Message card
 * 
 * @param message The message data
 * @returns jsx
 */
function RdnMessage(message: object){
  return (
    <div 
      key={message.event_id}
      className={'card glow-green'}
      // @ts-ignore classList does exist on this target
      onMouseOver={(e) => {e.target.classList.remove('glow-green')}}
    >
      <div className={'card-header'}>
        <div>
          Type: {EVENT_TYPE_FRIENDLY_MAP[message.event_type]} ({message.event_type})
        </div>
        <div>
          Occurred At: {friendlyDateTime(new Date(message.occurred_at))}
        </div>
      </div>
      <div className={'card-body'}>
        New: {message.new} 
        <br/>
        Old: {message.old}
        <br/>
        Additional: {message.additional}
      </div>
      <div className={'card-footer'}>
        {message.event_id}
      </div>
    </div>
  )
}

/**
 * Returns a list of RdnMessage elements
 * 
 * @returns jsx
 */
function MessageList(){
  const firehoseResponse = usePollFirehose(30000) || {meta_data: []};
  const messages = firehoseResponse.meta_data;
  messages.sort((a, b) => {
    if(a.occurred_at > b.occurred_at){
      return -1;
    }
    if(a.occurred_at < b.occurred_at){
      return 1;
    }
    return 0;
  })
  const rdnMessageItems = firehoseResponse.meta_data.map(message => {
    return RdnMessage(message);
  });
  return rdnMessageItems;
}

export default function Home() {
  return (
    <div>
      <MessageList/>
    </div>
  );
}
