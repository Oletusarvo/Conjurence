import { withPlatformComponent } from '@/hoc/with-platform-component';
import EventTemplatesPage from './page.web';
import ClientEventTemplatesPage from './page.native';

export default withPlatformComponent(EventTemplatesPage, ClientEventTemplatesPage);
