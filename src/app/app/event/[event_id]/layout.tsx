import { withPlatformComponent } from '@/hoc/with-platform-component';
import EventPage from './layout.web';
import ClientEventPage from './layout.native';

export default withPlatformComponent(EventPage, ClientEventPage);
