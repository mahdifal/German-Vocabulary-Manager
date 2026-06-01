-- Seed script for German vocabulary test data.
-- Replace the email below with your account email, then run in Supabase SQL Editor.

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Look up the user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'mehdi.kindly@gmail.com'  -- ← change if needed
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Check the email address above.';
  END IF;

  INSERT INTO public.vocabularies (user_id, german_word, article, persian_translation, example_sentence, level)
  VALUES
    -- A1
    (v_user_id, 'Haus',    'das', 'خانه',                   'Das Haus ist groß.',                                      'A1'),
    (v_user_id, 'Hund',    'der', 'سگ',                     'Der Hund bellt laut.',                                    'A1'),
    (v_user_id, 'Katze',   'die', 'گربه',                   'Die Katze schläft auf dem Sofa.',                         'A1'),
    (v_user_id, 'Buch',    'das', 'کتاب',                   'Ich lese ein Buch.',                                      'A1'),
    (v_user_id, 'Wasser',  'das', 'آب',                     'Ich trinke Wasser.',                                      'A1'),
    (v_user_id, 'Kind',    'das', 'کودک',                   'Das Kind spielt im Garten.',                              'A1'),
    (v_user_id, 'Mann',    'der', 'مرد',                    'Der Mann liest die Zeitung.',                             'A1'),
    (v_user_id, 'Frau',    'die', 'زن',                     'Die Frau kocht das Essen.',                               'A1'),

    -- A2
    (v_user_id, 'Bahnhof', 'der', 'ایستگاه قطار',           'Der Bahnhof ist in der Stadtmitte.',                      'A2'),
    (v_user_id, 'Straße',  'die', 'خیابان',                 'Die Straße ist sehr lang.',                               'A2'),
    (v_user_id, 'Arbeit',  'die', 'کار',                    'Er geht jeden Tag zur Arbeit.',                           'A2'),
    (v_user_id, 'Freund',  'der', 'دوست (مذکر)',             'Mein Freund wohnt in Berlin.',                            'A2'),
    (v_user_id, 'Schule',  'die', 'مدرسه',                  'Die Kinder gehen in die Schule.',                         'A2'),
    (v_user_id, 'Sprache', 'die', 'زبان',                   'Deutsch ist eine schöne Sprache.',                        'A2'),

    -- B1
    (v_user_id, 'Erfahrung',   'die', 'تجربه',              'Sie hat viel Erfahrung in diesem Beruf.',                 'B1'),
    (v_user_id, 'Meinung',     'die', 'نظر / عقیده',         'Meiner Meinung nach ist das richtig.',                    'B1'),
    (v_user_id, 'Entscheidung','die', 'تصمیم',               'Das war eine schwierige Entscheidung.',                   'B1'),
    (v_user_id, 'Gelegenheit', 'die', 'فرصت',               'Ich hatte keine Gelegenheit, ihn zu treffen.',            'B1'),
    (v_user_id, 'Verhalten',   'das', 'رفتار',              'Sein Verhalten war sehr seltsam.',                        'B1'),

    -- B2
    (v_user_id, 'Verantwortung', 'die', 'مسئولیت',          'Er trägt die Verantwortung für das Projekt.',             'B2'),
    (v_user_id, 'Zusammenhang', 'der', 'ارتباط / پیوند',     'Der Zusammenhang zwischen den Ereignissen ist klar.',     'B2'),
    (v_user_id, 'Voraussetzung','die', 'پیش‌نیاز / شرط',    'Gute Sprachkenntnisse sind Voraussetzung für den Job.',   'B2'),
    (v_user_id, 'Gesellschaft', 'die', 'جامعه',             'Die Gesellschaft verändert sich ständig.',                'B2'),

    -- C1
    (v_user_id, 'Beeinträchtigung',  'die', 'اختلال / آسیب',     'Eine Beeinträchtigung des Sehvermögens kann verschiedene Ursachen haben.', 'C1'),
    (v_user_id, 'Auseinandersetzung','die', 'بحث / درگیری',       'Es kam zu einer heftigen Auseinandersetzung zwischen den Parteien.',      'C1'),
    (v_user_id, 'Erschöpfung',       'die', 'خستگی شدید / فرسودگی','Nach der langen Reise litt er unter totaler Erschöpfung.',             'C1'),

    -- C2
    (v_user_id, 'Weltanschauung',       'die', 'جهان‌بینی',                      'Seine Weltanschauung wurde durch die Philosophie Kants geprägt.',       'C2'),
    (v_user_id, 'Fingerspitzengefühl',  'das', 'ظرافت / حساسیت در برخورد',       'In dieser Situation braucht man viel Fingerspitzengefühl.',             'C2'),
    (v_user_id, 'Verschlimmbessern',    'das', 'بدتر کردن در تلاش برای بهتر کردن','Durch sein Eingreifen kam es zu einem klassischen Verschlimmbessern.', 'C2');

  RAISE NOTICE 'Seeded 30 vocabulary words for user %', v_user_id;
END;
$$;
