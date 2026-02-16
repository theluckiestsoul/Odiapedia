import 'package:flutter_test/flutter_test.dart';
import 'package:odiapedia/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const OdiapediaApp());

    // Verify that the app renders
    expect(find.text('Odiapedia'), findsOneWidget);
  });
}
