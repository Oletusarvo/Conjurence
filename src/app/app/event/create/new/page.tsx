import { withPlatformComponent } from '@/hoc/with-platform-component';
import CreateEventPage from './page.web';
import ClientCreateEventPage from './page.native';

export default withPlatformComponent(CreateEventPage, ClientCreateEventPage);
